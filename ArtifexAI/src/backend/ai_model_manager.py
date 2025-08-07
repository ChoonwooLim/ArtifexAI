"""
AI Model Manager - Integrates best-in-class AI models for each task
"""

import os
import aiohttp
import asyncio
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import json
from enum import Enum

class AIProvider(Enum):
    # Video Generation
    RUNWAY_GEN3 = "runway_gen3"  # Best for video generation
    PIKA_LABS = "pika_labs"  # High quality video
    STABILITY_VIDEO = "stability_video"  # Stable Video Diffusion
    MOONVALLEY = "moonvalley"  # Cinematic quality
    HAIPER = "haiper"  # Fast video generation
    LUMA_DREAM = "luma_dream_machine"  # Dream Machine
    KLING = "kling"  # Kuaishou's video model
    COGVIDEO = "cogvideo"  # CogVideoX
    
    # Image Generation
    MIDJOURNEY = "midjourney"  # Best artistic quality
    DALL_E_3 = "dalle3"  # OpenAI DALL-E 3
    STABLE_DIFFUSION_XL = "sdxl"  # Open source
    FLUX_PRO = "flux_pro"  # Black Forest Labs
    LEONARDO_AI = "leonardo"  # Game assets & consistency
    IDEOGRAM = "ideogram"  # Text rendering
    
    # Audio/Music
    SUNO_AI = "suno"  # Best music generation
    UDIO = "udio"  # High quality music
    MUSICGEN = "musicgen"  # Meta's music model
    AUDIOCRAFT = "audiocraft"  # Sound effects
    ELEVENLABS = "elevenlabs"  # Voice synthesis
    RIFFUSION = "riffusion"  # Stable diffusion for audio
    
    # Text/Script
    CLAUDE_3_OPUS = "claude3_opus"  # Best for creative writing
    GPT_4_TURBO = "gpt4_turbo"  # OpenAI's best
    GEMINI_ULTRA = "gemini_ultra"  # Google's best
    LLAMA_3_405B = "llama3_405b"  # Open source giant
    
    # Specialized
    WONDER_DYNAMICS = "wonder_dynamics"  # Motion capture
    DEEPMOTION = "deepmotion"  # AI motion capture
    CASCADEUR = "cascadeur"  # Physics-based animation
    MOVE_AI = "move_ai"  # Markerless mocap
    D_ID = "d_id"  # Avatar animation
    HEYGEN = "heygen"  # Avatar video
    SYNTHESIA = "synthesia"  # AI avatars
    
    # Voice & Speech
    PLAY_HT = "playht"  # Ultra realistic voices
    MURF_AI = "murf"  # Voice over
    RESEMBLE_AI = "resemble"  # Voice cloning
    DESCRIPT_OVERDUB = "overdub"  # Voice editing
    
    # Enhancement & Post
    TOPAZ_VIDEO_AI = "topaz"  # Video enhancement
    REAL_ESRGAN = "realesrgan"  # Upscaling
    FLOWFRAMES = "flowframes"  # Frame interpolation
    DEOLDIFY = "deoldify"  # Colorization

@dataclass
class APIConfig:
    """Configuration for each AI API"""
    provider: AIProvider
    api_key: str
    endpoint: str
    version: str
    rate_limit: int
    cost_per_request: float
    capabilities: List[str]
    max_resolution: Optional[str] = None
    max_duration: Optional[int] = None
    supported_formats: List[str] = None

class AIModelManager:
    def __init__(self):
        self.configs: Dict[AIProvider, APIConfig] = {}
        self.session: Optional[aiohttp.ClientSession] = None
        self.load_api_configs()
        
    def load_api_configs(self):
        """Load API configurations from environment or config file"""
        
        # Video Generation APIs
        self.configs[AIProvider.RUNWAY_GEN3] = APIConfig(
            provider=AIProvider.RUNWAY_GEN3,
            api_key=os.getenv("RUNWAY_API_KEY", ""),
            endpoint="https://api.runwayml.com/v1/",
            version="gen3_alpha",
            rate_limit=10,
            cost_per_request=0.05,
            capabilities=["text2video", "image2video", "video2video"],
            max_resolution="1280x768",
            max_duration=10,
            supported_formats=["mp4", "mov"]
        )
        
        self.configs[AIProvider.PIKA_LABS] = APIConfig(
            provider=AIProvider.PIKA_LABS,
            api_key=os.getenv("PIKA_API_KEY", ""),
            endpoint="https://api.pika.art/v1/",
            version="1.0",
            rate_limit=20,
            cost_per_request=0.04,
            capabilities=["text2video", "image2video", "video_editing"],
            max_resolution="1024x576",
            max_duration=3,
            supported_formats=["mp4", "gif"]
        )
        
        self.configs[AIProvider.LUMA_DREAM] = APIConfig(
            provider=AIProvider.LUMA_DREAM,
            api_key=os.getenv("LUMA_API_KEY", ""),
            endpoint="https://api.lumalabs.ai/dream-machine/v1/",
            version="1.5",
            rate_limit=15,
            cost_per_request=0.03,
            capabilities=["text2video", "image2video", "keyframe_animation"],
            max_resolution="1920x1080",
            max_duration=5,
            supported_formats=["mp4", "webm"]
        )
        
        self.configs[AIProvider.KLING] = APIConfig(
            provider=AIProvider.KLING,
            api_key=os.getenv("KLING_API_KEY", ""),
            endpoint="https://api.kuaishou.com/kling/v1/",
            version="1.0",
            rate_limit=10,
            cost_per_request=0.02,
            capabilities=["text2video", "image2video"],
            max_resolution="1280x720",
            max_duration=5,
            supported_formats=["mp4"]
        )
        
        # Image Generation APIs
        self.configs[AIProvider.MIDJOURNEY] = APIConfig(
            provider=AIProvider.MIDJOURNEY,
            api_key=os.getenv("MIDJOURNEY_API_KEY", ""),
            endpoint="https://api.midjourney.com/v1/",
            version="6.0",
            rate_limit=10,
            cost_per_request=0.02,
            capabilities=["text2image", "image_variation", "upscale", "style_transfer"],
            max_resolution="2048x2048",
            supported_formats=["png", "jpg", "webp"]
        )
        
        self.configs[AIProvider.DALL_E_3] = APIConfig(
            provider=AIProvider.DALL_E_3,
            api_key=os.getenv("OPENAI_API_KEY", ""),
            endpoint="https://api.openai.com/v1/images/",
            version="dall-e-3",
            rate_limit=5,
            cost_per_request=0.04,
            capabilities=["text2image", "image_edit", "image_variation"],
            max_resolution="1792x1024",
            supported_formats=["png", "jpg"]
        )
        
        self.configs[AIProvider.FLUX_PRO] = APIConfig(
            provider=AIProvider.FLUX_PRO,
            api_key=os.getenv("FLUX_API_KEY", ""),
            endpoint="https://api.blackforestlabs.ai/v1/",
            version="flux.1_pro",
            rate_limit=20,
            cost_per_request=0.01,
            capabilities=["text2image", "controlnet", "inpainting"],
            max_resolution="2048x2048",
            supported_formats=["png", "jpg"]
        )
        
        self.configs[AIProvider.LEONARDO_AI] = APIConfig(
            provider=AIProvider.LEONARDO_AI,
            api_key=os.getenv("LEONARDO_API_KEY", ""),
            endpoint="https://cloud.leonardo.ai/api/rest/v1/",
            version="1.0",
            rate_limit=30,
            cost_per_request=0.005,
            capabilities=["text2image", "consistent_character", "game_assets"],
            max_resolution="1024x1024",
            supported_formats=["png", "jpg"]
        )
        
        # Audio/Music APIs
        self.configs[AIProvider.SUNO_AI] = APIConfig(
            provider=AIProvider.SUNO_AI,
            api_key=os.getenv("SUNO_API_KEY", ""),
            endpoint="https://api.suno.ai/v1/",
            version="3.5",
            rate_limit=10,
            cost_per_request=0.08,
            capabilities=["text2music", "lyrics_generation", "style_remix"],
            max_duration=240,
            supported_formats=["mp3", "wav", "flac"]
        )
        
        self.configs[AIProvider.UDIO] = APIConfig(
            provider=AIProvider.UDIO,
            api_key=os.getenv("UDIO_API_KEY", ""),
            endpoint="https://api.udio.com/v1/",
            version="1.0",
            rate_limit=10,
            cost_per_request=0.06,
            capabilities=["text2music", "music_extension", "stem_separation"],
            max_duration=300,
            supported_formats=["mp3", "wav"]
        )
        
        self.configs[AIProvider.ELEVENLABS] = APIConfig(
            provider=AIProvider.ELEVENLABS,
            api_key=os.getenv("ELEVENLABS_API_KEY", ""),
            endpoint="https://api.elevenlabs.io/v1/",
            version="2.0",
            rate_limit=20,
            cost_per_request=0.01,
            capabilities=["text2speech", "voice_cloning", "speech2speech"],
            supported_formats=["mp3", "wav", "flac"]
        )
        
        # Text/Script APIs
        self.configs[AIProvider.CLAUDE_3_OPUS] = APIConfig(
            provider=AIProvider.CLAUDE_3_OPUS,
            api_key=os.getenv("ANTHROPIC_API_KEY", ""),
            endpoint="https://api.anthropic.com/v1/",
            version="claude-3-opus-20240229",
            rate_limit=10,
            cost_per_request=0.015,
            capabilities=["script_writing", "dialogue", "story_generation", "editing"]
        )
        
        self.configs[AIProvider.GPT_4_TURBO] = APIConfig(
            provider=AIProvider.GPT_4_TURBO,
            api_key=os.getenv("OPENAI_API_KEY", ""),
            endpoint="https://api.openai.com/v1/",
            version="gpt-4-turbo-preview",
            rate_limit=10,
            cost_per_request=0.01,
            capabilities=["script_writing", "code_generation", "analysis"]
        )
        
        # Motion Capture & Animation
        self.configs[AIProvider.WONDER_DYNAMICS] = APIConfig(
            provider=AIProvider.WONDER_DYNAMICS,
            api_key=os.getenv("WONDER_API_KEY", ""),
            endpoint="https://api.wonderdynamics.com/v1/",
            version="1.0",
            rate_limit=5,
            cost_per_request=0.1,
            capabilities=["mocap", "body_tracking", "face_tracking", "cg_integration"],
            supported_formats=["fbx", "bvh", "usd"]
        )
        
        # Voice & Avatar
        self.configs[AIProvider.HEYGEN] = APIConfig(
            provider=AIProvider.HEYGEN,
            api_key=os.getenv("HEYGEN_API_KEY", ""),
            endpoint="https://api.heygen.com/v1/",
            version="2.0",
            rate_limit=10,
            cost_per_request=0.05,
            capabilities=["avatar_video", "voice_sync", "translation"],
            max_resolution="1920x1080",
            supported_formats=["mp4", "webm"]
        )
        
        # Enhancement
        self.configs[AIProvider.TOPAZ_VIDEO_AI] = APIConfig(
            provider=AIProvider.TOPAZ_VIDEO_AI,
            api_key=os.getenv("TOPAZ_API_KEY", ""),
            endpoint="https://api.topazlabs.com/v1/",
            version="3.0",
            rate_limit=5,
            cost_per_request=0.1,
            capabilities=["upscaling", "denoising", "stabilization", "frame_interpolation"],
            max_resolution="8192x8192",
            supported_formats=["mp4", "mov", "avi"]
        )
    
    async def initialize(self):
        """Initialize the HTTP session"""
        if not self.session:
            self.session = aiohttp.ClientSession()
    
    async def close(self):
        """Close the HTTP session"""
        if self.session:
            await self.session.close()
    
    async def generate_video(
        self,
        prompt: str,
        provider: AIProvider = AIProvider.RUNWAY_GEN3,
        image: Optional[bytes] = None,
        duration: int = 5,
        resolution: str = "1280x720",
        **kwargs
    ) -> Dict[str, Any]:
        """Generate video using the specified AI provider"""
        
        config = self.configs.get(provider)
        if not config:
            raise ValueError(f"Provider {provider} not configured")
        
        if provider == AIProvider.RUNWAY_GEN3:
            return await self._runway_gen3_video(prompt, image, duration, resolution, config)
        elif provider == AIProvider.PIKA_LABS:
            return await self._pika_video(prompt, image, duration, resolution, config)
        elif provider == AIProvider.LUMA_DREAM:
            return await self._luma_video(prompt, image, duration, resolution, config)
        elif provider == AIProvider.KLING:
            return await self._kling_video(prompt, image, duration, resolution, config)
        elif provider == AIProvider.STABILITY_VIDEO:
            return await self._stability_video(prompt, image, duration, resolution, config)
        else:
            raise NotImplementedError(f"Provider {provider} not implemented")
    
    async def _runway_gen3_video(
        self,
        prompt: str,
        image: Optional[bytes],
        duration: int,
        resolution: str,
        config: APIConfig
    ) -> Dict[str, Any]:
        """Generate video using Runway Gen-3"""
        
        headers = {
            "Authorization": f"Bearer {config.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "text_prompt": prompt,
            "duration": min(duration, config.max_duration),
            "resolution": resolution,
            "model": config.version
        }
        
        if image:
            # Convert image to base64 and add to request
            import base64
            data["init_image"] = base64.b64encode(image).decode('utf-8')
        
        async with self.session.post(
            f"{config.endpoint}generations",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            
            # Poll for completion
            generation_id = result.get("id")
            while True:
                async with self.session.get(
                    f"{config.endpoint}generations/{generation_id}",
                    headers=headers
                ) as status_response:
                    status_data = await status_response.json()
                    if status_data["status"] == "completed":
                        return {
                            "url": status_data["output_url"],
                            "provider": "Runway Gen-3",
                            "cost": config.cost_per_request
                        }
                    elif status_data["status"] == "failed":
                        raise Exception(f"Generation failed: {status_data.get('error')}")
                    
                    await asyncio.sleep(5)
    
    async def _pika_video(
        self,
        prompt: str,
        image: Optional[bytes],
        duration: int,
        resolution: str,
        config: APIConfig
    ) -> Dict[str, Any]:
        """Generate video using Pika Labs"""
        
        headers = {
            "Authorization": f"Bearer {config.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "seconds": min(duration, config.max_duration),
            "resolution": resolution,
            "motion": kwargs.get("motion", 3)  # Motion intensity 1-10
        }
        
        if image:
            import base64
            data["image"] = base64.b64encode(image).decode('utf-8')
        
        async with self.session.post(
            f"{config.endpoint}generate",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            return {
                "url": result["video_url"],
                "provider": "Pika Labs",
                "cost": config.cost_per_request
            }
    
    async def generate_image(
        self,
        prompt: str,
        provider: AIProvider = AIProvider.MIDJOURNEY,
        negative_prompt: Optional[str] = None,
        style: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using the specified AI provider"""
        
        config = self.configs.get(provider)
        if not config:
            raise ValueError(f"Provider {provider} not configured")
        
        if provider == AIProvider.MIDJOURNEY:
            return await self._midjourney_image(prompt, style, config, **kwargs)
        elif provider == AIProvider.DALL_E_3:
            return await self._dalle3_image(prompt, style, config, **kwargs)
        elif provider == AIProvider.FLUX_PRO:
            return await self._flux_image(prompt, negative_prompt, config, **kwargs)
        elif provider == AIProvider.LEONARDO_AI:
            return await self._leonardo_image(prompt, negative_prompt, style, config, **kwargs)
        else:
            raise NotImplementedError(f"Provider {provider} not implemented")
    
    async def _midjourney_image(
        self,
        prompt: str,
        style: Optional[str],
        config: APIConfig,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate image using Midjourney"""
        
        headers = {
            "Authorization": f"Bearer {config.api_key}",
            "Content-Type": "application/json"
        }
        
        # Midjourney style parameters
        full_prompt = prompt
        if style:
            full_prompt += f" --style {style}"
        if kwargs.get("aspect_ratio"):
            full_prompt += f" --ar {kwargs['aspect_ratio']}"
        if kwargs.get("quality"):
            full_prompt += f" --q {kwargs['quality']}"
        if kwargs.get("stylize"):
            full_prompt += f" --s {kwargs['stylize']}"
        
        data = {
            "prompt": full_prompt,
            "version": config.version
        }
        
        async with self.session.post(
            f"{config.endpoint}imagine",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            
            # Wait for generation
            job_id = result["job_id"]
            while True:
                async with self.session.get(
                    f"{config.endpoint}job/{job_id}",
                    headers=headers
                ) as status_response:
                    status_data = await status_response.json()
                    if status_data["status"] == "completed":
                        return {
                            "urls": status_data["image_urls"],
                            "provider": "Midjourney",
                            "cost": config.cost_per_request
                        }
                    await asyncio.sleep(3)
    
    async def generate_music(
        self,
        prompt: str,
        provider: AIProvider = AIProvider.SUNO_AI,
        duration: int = 60,
        genre: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate music using the specified AI provider"""
        
        config = self.configs.get(provider)
        if not config:
            raise ValueError(f"Provider {provider} not configured")
        
        if provider == AIProvider.SUNO_AI:
            return await self._suno_music(prompt, duration, genre, config, **kwargs)
        elif provider == AIProvider.UDIO:
            return await self._udio_music(prompt, duration, genre, config, **kwargs)
        elif provider == AIProvider.MUSICGEN:
            return await self._musicgen_music(prompt, duration, config, **kwargs)
        else:
            raise NotImplementedError(f"Provider {provider} not implemented")
    
    async def _suno_music(
        self,
        prompt: str,
        duration: int,
        genre: Optional[str],
        config: APIConfig,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate music using Suno AI"""
        
        headers = {
            "Authorization": f"Bearer {config.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "prompt": prompt,
            "duration": min(duration, config.max_duration),
            "tags": genre or "pop",
            "instrumental": kwargs.get("instrumental", False),
            "make_public": False
        }
        
        if kwargs.get("lyrics"):
            data["lyrics"] = kwargs["lyrics"]
        
        async with self.session.post(
            f"{config.endpoint}generate",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            return {
                "url": result["audio_url"],
                "provider": "Suno AI",
                "cost": config.cost_per_request,
                "lyrics": result.get("lyrics")
            }
    
    async def generate_voice(
        self,
        text: str,
        provider: AIProvider = AIProvider.ELEVENLABS,
        voice_id: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate voice/speech using the specified AI provider"""
        
        config = self.configs.get(provider)
        if not config:
            raise ValueError(f"Provider {provider} not configured")
        
        if provider == AIProvider.ELEVENLABS:
            return await self._elevenlabs_voice(text, voice_id, config, **kwargs)
        elif provider == AIProvider.PLAY_HT:
            return await self._playht_voice(text, voice_id, config, **kwargs)
        else:
            raise NotImplementedError(f"Provider {provider} not implemented")
    
    async def _elevenlabs_voice(
        self,
        text: str,
        voice_id: Optional[str],
        config: APIConfig,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate voice using ElevenLabs"""
        
        headers = {
            "xi-api-key": config.api_key,
            "Content-Type": "application/json"
        }
        
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": kwargs.get("stability", 0.5),
                "similarity_boost": kwargs.get("similarity", 0.5),
                "style": kwargs.get("style", 0.0),
                "use_speaker_boost": True
            }
        }
        
        voice_id = voice_id or "21m00Tcm4TlvDq8ikWAM"  # Default voice
        
        async with self.session.post(
            f"{config.endpoint}text-to-speech/{voice_id}",
            headers=headers,
            json=data
        ) as response:
            audio_data = await response.read()
            return {
                "audio": audio_data,
                "provider": "ElevenLabs",
                "cost": config.cost_per_request
            }
    
    async def generate_script(
        self,
        prompt: str,
        provider: AIProvider = AIProvider.CLAUDE_3_OPUS,
        max_tokens: int = 4000,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate script/text using the specified AI provider"""
        
        config = self.configs.get(provider)
        if not config:
            raise ValueError(f"Provider {provider} not configured")
        
        if provider == AIProvider.CLAUDE_3_OPUS:
            return await self._claude_script(prompt, max_tokens, config, **kwargs)
        elif provider == AIProvider.GPT_4_TURBO:
            return await self._gpt4_script(prompt, max_tokens, config, **kwargs)
        else:
            raise NotImplementedError(f"Provider {provider} not implemented")
    
    async def _claude_script(
        self,
        prompt: str,
        max_tokens: int,
        config: APIConfig,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate script using Claude 3 Opus"""
        
        headers = {
            "x-api-key": config.api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json"
        }
        
        system_prompt = kwargs.get("system", "You are a professional screenwriter and creative director.")
        
        data = {
            "model": config.version,
            "max_tokens": max_tokens,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "system": system_prompt,
            "temperature": kwargs.get("temperature", 0.7)
        }
        
        async with self.session.post(
            f"{config.endpoint}messages",
            headers=headers,
            json=data
        ) as response:
            result = await response.json()
            return {
                "text": result["content"][0]["text"],
                "provider": "Claude 3 Opus",
                "cost": config.cost_per_request
            }
    
    def get_best_provider_for_task(self, task: str) -> AIProvider:
        """Get the recommended provider for a specific task"""
        
        recommendations = {
            "video_generation": AIProvider.RUNWAY_GEN3,
            "cinematic_video": AIProvider.MOONVALLEY,
            "fast_video": AIProvider.HAIPER,
            "artistic_image": AIProvider.MIDJOURNEY,
            "photorealistic_image": AIProvider.DALL_E_3,
            "consistent_character": AIProvider.LEONARDO_AI,
            "music_generation": AIProvider.SUNO_AI,
            "voice_synthesis": AIProvider.ELEVENLABS,
            "script_writing": AIProvider.CLAUDE_3_OPUS,
            "motion_capture": AIProvider.WONDER_DYNAMICS,
            "avatar_video": AIProvider.HEYGEN,
            "video_enhancement": AIProvider.TOPAZ_VIDEO_AI
        }
        
        return recommendations.get(task, AIProvider.RUNWAY_GEN3)
    
    def estimate_cost(self, workflow: List[Dict[str, Any]]) -> float:
        """Estimate the total cost for a workflow"""
        
        total_cost = 0.0
        for step in workflow:
            provider = step.get("provider")
            if provider in self.configs:
                total_cost += self.configs[provider].cost_per_request * step.get("count", 1)
        
        return total_cost
    
    async def batch_process(
        self,
        tasks: List[Dict[str, Any]],
        parallel: bool = True
    ) -> List[Dict[str, Any]]:
        """Process multiple AI tasks in batch"""
        
        if parallel:
            results = await asyncio.gather(*[
                self._process_task(task) for task in tasks
            ])
        else:
            results = []
            for task in tasks:
                result = await self._process_task(task)
                results.append(result)
        
        return results
    
    async def _process_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single AI task"""
        
        task_type = task.get("type")
        provider = task.get("provider")
        
        if task_type == "video":
            return await self.generate_video(
                task["prompt"],
                provider,
                **task.get("params", {})
            )
        elif task_type == "image":
            return await self.generate_image(
                task["prompt"],
                provider,
                **task.get("params", {})
            )
        elif task_type == "music":
            return await self.generate_music(
                task["prompt"],
                provider,
                **task.get("params", {})
            )
        elif task_type == "voice":
            return await self.generate_voice(
                task["text"],
                provider,
                **task.get("params", {})
            )
        elif task_type == "script":
            return await self.generate_script(
                task["prompt"],
                provider,
                **task.get("params", {})
            )
        else:
            raise ValueError(f"Unknown task type: {task_type}")

# Export the manager
ai_manager = AIModelManager()